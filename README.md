# AI Assistant

## Activate Gemini Nano in chrome
1. Download Chrome [Dev channel](https://www.google.com/chrome/dev/)
2. Follow these steps to enable Gemini Nano and the Prompt API flags for local experimentation:
    - Open a new tab in Chrome, go to chrome://flags/#optimization-guide-on-device-model
    - Select Enabled BypassPerfRequirement
    - Go to chrome://flags/#prompt-api-for-gemini-nano
    - Select Enabled
    - Restart Chrome
3. Confirm availability of Gemini Nano
    - Open DevTools and send (await ai.languageModel.capabilities()).available; in the console. 
    - If this returns “readily”, then you are all set. 
    - If this fails, continue as follows:
        - 📣🆕 Force Chrome to recognize that you want to use this API. To do so, open DevTools and send  await ai.languageModel.create(); in the console. This will likely fail but it’s intended.
        - Relaunch Chrome. 
        - Open a new tab in Chrome, go to chrome://components 
        - Confirm that Gemini Nano is either available or is being downloaded
           - You'll want to see the Optimization Guide On Device Model present with a version greater or equal to 2024.5.21.1031.
           - If there is no version listed, click on Check for update to force the download.
        - Once the model has downloaded and has reached a version greater than shown above, open DevTools and send (await ai.languageModel.capabilities()).available; in the console. If this returns “readily”, then you are all set. 
            - Otherwise, relaunch, wait for a little while, and try again from step 3 

This is taken out from the early preview program of the [Prompt API](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0).

### Key commands to test that the model is available
- Chrome links:
    - `chrome://flags/#optimization-guide-on-device-model` -> Enabled BypassPerfRequirement
    - `chrome://flags/#prompt-api-for-gemini-nano` -> Enabled
    - `chrome://components` -> Optimization Guide On Device Model
- `(await ai.languageModel.capabilities()).available;`
- `await ai.languageModel.create();`


## To run the assistant
    Load extension in extensions window of Google Chrome (unstable). In any window click extensions and open the loaded extension. A window will pop up and you now can communicate with the IA.
