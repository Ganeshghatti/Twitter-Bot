const transporter = require("../../config/email");
const { createPostEmailTemplate } = require("./templates/createPostTemplate");
const path = require("path");

const NotifyCreatePost = async (post) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: ["info@thesquirrel.site", "ganeshghatti6@gmail.com"],
      subject: "New Post Created - The Squirrel Bot",
      html: createPostEmailTemplate(post),
      attachments: [{
        filename: path.basename(post.img),
        path: post.img,
        cid: path.basename(post.img)
      }]
    });
    console.log('Creation notification email sent successfully for post');
  } catch (error) {
    console.error('Error sending creation notification email:', error.message);
  }
};

module.exports = NotifyCreatePost;
