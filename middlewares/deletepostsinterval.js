const cron = require('node-cron');
const { sequelize} = require('../Config/database'); 


const deleteOldPosts = async () => {
    const timeThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const transaction = await sequelize.transaction();

    try {
        //delete related postLikes
        await sequelize.query(
            `DELETE FROM "postLikes"
             WHERE "postId" IN (
                SELECT "id" FROM "posts"
                WHERE "clubid" IS NOT NULL 
                AND "createdAt" < :timeThreshold
             )`,
            {
                replacements: { timeThreshold: timeThreshold.toISOString() },
                type: sequelize.QueryTypes.DELETE,
                transaction
            }
        );

        //delete related comments
        await sequelize.query(
            `DELETE FROM "comments"
             WHERE "postId" IN (
                SELECT "id" FROM "posts"
                WHERE "clubid" IS NOT NULL 
                AND "createdAt" < :timeThreshold
             )`,
            {
                replacements: { timeThreshold: timeThreshold.toISOString() },
                type: sequelize.QueryTypes.DELETE,
                transaction
            }
        );

        // delete the posts
        await sequelize.query(
            `DELETE FROM "posts"
             WHERE "clubid" IS NOT NULL 
             AND "createdAt" < :timeThreshold`,
            {
                replacements: { timeThreshold: timeThreshold.toISOString() },
                type: sequelize.QueryTypes.DELETE,
                transaction
            }
        );

        await transaction.commit();
        console.log('Old posts and associated data deleted successfully');
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting old posts and associated data:', error);
    }
};

module.exports = deleteOldPosts;

