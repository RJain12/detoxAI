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
Also, keep in mind that you have Visual [Studio Community 2022](https://visualstudio.microsoft.com/) installed with "Development with C++" on it. The bot won't be able to run if you use a normal Visual Studio Code.
# Features
- Uses TensorflowJS's Toxicity model to delete toxic Discord messages.
- Deletes small set of blacklisted reactions on messages.
- Deletes images detected as NSFW by DeepAI's image API.

# Credits
Rishab Jain (RJain12), Avighnash Kumar, Rushil Srirambhatla
