# detoxAI
A simple AI-powered moderation Discord Bot! PRs & issues are welcome :)

# Self-Hosting
You can either install the bot into your Discord community, or self-host a version of the bot. We would **recommend installing our instance of the bot** as it is already configured with our database and is more reliable.

**Invite/Install here:** https://dsc.gg/detox

After inviting the bot, run the `/setup` command and you're done!

Alternatively, you can self-host the bot (complicated).

To self-host the bot, you would need to create the following environmental variables:

```
  TOKEN=your discord bot token
  STATCORD=statcord token (optional)
  ID=bot client ID
  DEEPAI=deepAI API key
```

As well as the following file:
- `firestoreKey.json`: a service account key to your [Firestore](https://cloud.google.com/firestore) database.

To obtain the firestoreKey.json file, you need to follow these steps:

1. to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2. Click on the gear icon in the top left corner and select "Project settings".
3. In the "Project settings" page, go to the "Service accounts" tab.
4. Scroll down to the section titled "Firestore Database Admin SDK" and click on "Generate new private key".
5. A JSON file containing your project's service account credentials will be downloaded to your computer. This is your firestoreKey.json file.
Note: Keep the firestoreKey.json file secure and do not share it with anyone. It contains sensitive information that can grant access to your Firebase project

Also, keep in mind that you have Visual [Studio Community 2022](https://visualstudio.microsoft.com/) installed with "Development with C++" on it. The bot won't be able to run if you use a normal Visual Studio Code.
# Features
- Uses TensorflowJS's Toxicity model to delete toxic Discord messages.
- Deletes small set of blacklisted reactions on messages.
- Deletes images detected as NSFW by DeepAI's image API.

# Credits
Rishab Jain (RJain12), Avighnash Kumar, Rushil Srirambhatla
