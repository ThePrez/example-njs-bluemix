This is a quick node.js application calls IBM i via IBM node.js REST toolkit.
This repository serves as the source of a simple activity to try out Eclipse Orion and IBM Bluemix. 


### Activity steps ###
1. Create or log into your IBM Bluemix account at http://console.ng.bluemix.net/ 
2. Log into Eclipse Orion at http://embox1.demos.ibm.com:2025 using your GitHub account
3. From the git view in Orion (git logo on the left![git icon](https://git-scm.com/favicon.ico)), clone repository ```https://github.com/ThePrez/example-njs-bluemix``` (use default options)
4. Configure Bluemix as your cloud hosting environment by doing the following:
    * From the settings view (gear icon on the left), go to Cloud Foundry settings
    * As the API URL, enter ```https://api.ng.bluemix.net```
    * As the Manage URL, enter ```https://console.ng.bluemix.net```
5. Deploy your application to Bluemix by doing the following:
    * From the edit view in orion (pencil icon on the left), go to "Create New Launch Configuration" (to be found along the top), click the plus sign. 
    * log in with your IBM Bluemix credentials (step 1)
    * Choose "IBMiNode-<your_surname>" as launch config name, application name, and host... Or really, anything unique (needs to be unique for all of bluemix users in that domain)
    * click save
    * Note a new file created in the launchConfigurations directory
    * Click the "play" button along the top (next to launch configurations) to deploy application to Bluemix. This may take several minutes
    * At this point, Orion will show status of deployment ("Deploying," "Running," etc.). You can also see the progress by logging into your Bluemix account at http://console.ng.bluemix.net/ 
    * When the application is deployed (status "Running"), click the "Open deployed app" 
6. Ask your instructor to make a change to the application
7. Download and deploy the changed application by doing the following
    * From the git view, click the "sync" button
    * From the edit view, click the "play" button to redeploy your application


