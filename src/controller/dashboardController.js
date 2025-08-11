const { Users } = require('../models');
const { Result } = require('../models');
const { Test } = require('../models');
const { Subject } = require('../models');
const mongoose = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.users.id;

        // Get current user with aggregated stats
        const [currentUser, leaderboard, recentResults] = await Promise.all([
            Users.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: 'results',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'results'
                    }
                },
                {
                    $project: {
                        name: 1,
                        totalScore: { $sum: '$results.score' },
                        testsCompleted: { $size: '$results' },
                        averageScore: {
                            $cond: [
                                { $gt: [{ $size: '$results' }, 0] },
                                {
                                    $round: [
                                        {
                                            $divide: [
                                                { $sum: '$results.score' },
                                                { $multiply: [{ $size: '$results' }, 100] }
                                            ]
                                        },
                                        2
                                    ]
                                },
                                0
                            ]
                        },
                        lastResults: { $slice: ['$results', 4] }
                    }
                }
            ]).then(results => results[0]),

            // Leaderboard
            Result.aggregate([
                {
                    $group: {
                        _id: '$user',
                        totalScore: { $sum: '$score' },
                        testCount: { $sum: 1 }
                    }
                },
                { $sort: { totalScore: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $project: {
                        name: '$user.name',
                        score: '$totalScore',
                        rank: { $indexOfArray: [['$totalScore'], '$totalScore'] }
                    }
                }
            ]),

            // Recent tests
            Result.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(4)
                .populate({
                    path: 'test',
                    select: 'testName minutes subjects',
                    populate: {
                        path: 'subjects',
                        select: 'nameUz'
                    }
                })
                .lean()
        ]);

        if (!currentUser) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        // Calculate rank
        const allUsers = await Users.aggregate([
            {
                $lookup: {
                    from: 'results',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'results'
                }
            },
            {
                $addFields: {
                    totalScore: { $sum: '$results.score' }
                }
            },
            { $sort: { totalScore: -1 } }
        ]);

        const rank = allUsers.findIndex(u => u._id.toString() === userId) + 1;

        // Process recent tests
        const recentTests = recentResults?.map(result => ({
            id: result._id,
            name: result.test.testName,
            score: result.score,
            maxScore: result.test.questionCount || 100,
            date: result.createdAt,
            duration: `${result.test.minutes} daq`,
            subject: result.test.subjects[0]?.nameUz || 'Umumiy'
        }));

        // Add ranks to leaderboard
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            ...user,
            rank: index + 1,
            avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        }));

        // Calculate streak
        const last7Days = await Result.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const dates = last7Days.map(d => d._id);

        for (let i = 0; i < dates.length; i++) {
            const checkDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];

            if (dates.includes(checkDate)) {
                streak++;
            } else {
                break;
            }
        }

        // Prepare response
        const dashboardData = {
            currentUser: {
                name: currentUser.name,
                rank,
                totalScore: currentUser.totalScore || 0,
                testsCompleted: currentUser.testsCompleted || 0,
                averageScore: Math.round((currentUser.averageScore || 0) * 100),
                streak
            },
            recentTests,
            leaderboard: rankedLeaderboard
        };

        console.log(dashboardData)

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Dashboard xatosi:', error);
        res.status(500).json({ message: 'Server xatosi' });
    }
};