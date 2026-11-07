Source: <https://seneca-ictoer.github.io/WEB530/Z-Guides/tool-dev-setup>

# Setup Tools & Dev Environment

This guide takes you through the setup of the tools needed for developing apps with React Native and Expo.

## VS Code

Visual Studio Code (also called VS Code) is a code editor. The application enables you to read, write, and edit code, much like how Word is used for reading, writing, and editing documents. VS Code is, if not the most used, then one of the most used code editors in web development.

* Download and install VS Code: <https://code.visualstudio.com/download>

### VS Code Extensions

* In VS Code, navigate to Extensions:

![VS Code Extensions](https://seneca-ictoer.github.io/WEB530/assets/images/vs-code-extensions-5bf19c42679c76568ba2c18ca06fb23f.png)

* Add the following extensions by entering part of the name in the search box, and clicking “Install” (be sure to check that it is the correct name and publisher):
  + [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) (dsznajder)
  + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (Microsoft)
  + [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (prettier.io)
  + [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) (Expo)
  + [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) (mhutchie)
  + [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) (Jun Han)
  + [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag) (Jun Han)

### Setup formatting

It's nice when your code looks neat, has the correct indentation, spacing, and line breaks. It makes the code easier to read and manage, and it makes it a lot easier to collaborate with others on a shared codebase. We can set up VS Code to help us format the code automatically when we save.

* Open the settings dialog, go to File —> Preferences —> Settings.
* Go to Text Editor —> Formatting. Enable “Format On Paste” and “Format On Save”. Hint: You can also search for “Format On” at the top of the window.

![VS Code Formatting Settings](https://seneca-ictoer.github.io/WEB530/assets/images/vs-code-formatting-64fd2b9d92b386dddd13f2e2f885a2a2.png)

* Search “Default Formatter” and select “Prettier - Code formatter”:

![VS Code Default Formatter](https://seneca-ictoer.github.io/WEB530/assets/images/vs-code-default-formatter-28c9e11f339e64866d41dc7888639c03.png)

* Close Visual Studio Code.

## Node.js and npm (Node Package Manager)

*React Native and Expo require Node.js to be installed.*

* Install Node.js using the prebuilt installer. You can download it from the official website: [https://nodejs.org/en/download](https://nodejs.org/en/download/)

  + Download the latest stable (LTS) version of Node.js. Do not use the “Current Version” as it may contain features that are considered unstable. Ensure you choose the correct operating system and bitness.

  ![NodeJS Installer](https://seneca-ictoer.github.io/WEB530/assets/images/nodejs-install-1ce431a5cc441460f6eb69f6d64c4d0f.png)
* Follow the installation instructions provided for your operating system. It is a good idea to reboot your system after the installation has completed.
* Once installed, you will have both Node.js and npm available in your command line/terminal interface.
* Test the successful installation by typing the following commands in the terminal or command prompt on your computer:

*You can also use the integrated terminal in VS Code. In VS Code, open the Terminal window by clicking the Terminal menu* —> *New Terminal.*

```
node --version
npm --version
```

## Expo Go App

* Install the [Expo Go](https://docs.expo.dev/get-started/set-up-your-environment/) app: To test your app on your mobile device, you'll need to install the Expo app. You can download it from the App Store (iOS) or Google Play (Android).
* Once you have the Expo app installed, you can scan the QR code in the Expo developer tools to load your app onto your mobile device (once you are running an Expo project).

Read more here: <https://docs.expo.dev/get-started/set-up-your-environment/>

## Git

Check if you have Git installed by running the following command in a terminal or command prompt (Beware: If you've only used GitHub Desktop, you won't have it available on the command line):

```
git --version
```

If the response is something other than `git version 2.x.x` then you must install Git:

a) If you're on a Mac and already running [Homebrew](https://brew.sh/), you can install it with:

```
brew install git
```

…or the equivalent command if you're already using a package manager on Windows or Linux.

b) Otherwise you can download and install Git [from the official website](https://git-scm.com/).

Then configure your [name](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git#setting-your-git-username-for-every-repository-on-your-computer) and [email](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address#setting-your-email-address-for-every-repository-on-your-computer), which will be “stamped” into any commits you make with these terminal commands:

```
git config --global user.name "YOUR_NAME"
git config --global user.email "YOUR_EMAIL"
```

### Optional: GitHub Copilot

If you don’t already have it, it is highly recommended to sign up for GitHub Copilot, which is GitHub’s “AI pair programmer” that is super useful when working with code. It is well integrated into VS Code and can be a very valuable companion when navigating a foreign codebase and a framework that you are actively learning to use, such as Expo and React Native.

1. You can get access for free through [GitHub Education](https://github.com/edu/students) if you sign in and verify your status as a student (please note that the approval process can take a few days).
2. Once you’ve signed up, follow their instructions for activating [GitHub Copilot](https://github.com/features/copilot/) on your account.
3. And then install [the required extension in VS Code](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor?tool=vscode). Follow that guide to experiment with the various ways to autocomplete code suggestions and to use the integrated chat function. We’ll demo it further during the course.

✋🏻 And that's it! You're now ready to start developing React Native apps with Expo.
