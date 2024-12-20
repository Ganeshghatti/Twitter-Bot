const { TwitterApi } = require("twitter-api-v2");
const cron = require("node-cron");
const moment = require("moment");
const Post = require("../models/Posts");
const NotifyPublishPost = require("../utils/mail/NotifyPublishPost");

const TwitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const rwClient = TwitterClient.readWrite;

const cronPublishPosts = async () => {
  try {
    const currentDate = moment();
    
    const postsToPublish = await Post.find({
      tobePublishedAt: {
        $lte: currentDate.toDate()
      },
      isPublished: false
    }).sort({ tobePublishedAt: 1 });
    
    console.log(`Checking for posts to publish at ${currentDate.format('MMMM Do YYYY, h:mm:ss a')}`);
    console.log(`Found ${postsToPublish.length} posts to publish`);
    
    if (postsToPublish.length > 0) {
      const nextPostTime = moment(postsToPublish[0].tobePublishedAt);
      const hoursLeft = nextPostTime.diff(currentDate, 'hours');
      console.log(`Hours left until the next post to publish: ${hoursLeft}`);
    }

    // Randomly log a post from the Post model
    const allPosts = await Post.find(); // Fetch all posts from the Post model
    if (allPosts.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPosts.length);
      console.log("Randomly selected post from Post model:", allPosts[randomIndex].tobePublishedAt);
      console.log(currentDate.toDate());
    }

    for (const post of postsToPublish) {
      try {
        console.log(`Publishing post scheduled for ${moment(post.tobePublishedAt).format('MMMM Do YYYY, h:mm:ss a')}`);
        const tweetlimit = post.text.slice(0, 250);

        const mediaId = await TwitterClient.v1.uploadMedia(post.img);
        await rwClient.v2.tweet({
          text: tweetlimit,
          media: { media_ids: [mediaId] },
        });

        post.isPublished = true;
        await post.save();
        
        console.log(`Tweet posted successfully at ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
        
        // Send notification for each published post individually
        await NotifyPublishPost(post);
      } catch (error) {
        console.error(`Error publishing post: ${error.message}`);
        continue; // Continue with next post if one fails
      }
    }
  } catch (error) {
    console.log("Error in Publish Posts CronJob:", error);
    await NotifyError(error.message, "cron Publish Posts");
  }
};

module.exports = { cronPublishPosts };

// Run every minute to check for posts to publish
cron.schedule('* * * * *', cronPublishPosts, {
  timezone: "Asia/Kolkata"
});
