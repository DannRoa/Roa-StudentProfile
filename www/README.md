# Student Profile Application

## 1. Project Description
This is my **UPDATED** Student Profile Web Application. It has a new feature such as camera integration. You can now update the profile picture by simply Taking a photo or Choosing a photo!

## 2. Application Pages
* **Profile**: This displays all my information Name, Course, Year lvl, About me, and Skills.
* **About**: This summarizes my background.
* **Skills**: This shows my technical skill sets.
* **Projects**: This features my academic projects I built.
* **Contact**: This is where all my contact info.

## 3. Profile Editing
This application features a local data editing. Via "Edit Profile", this updates the page state and persist locally through the browser/WebView **localStorage**.

## 4. Camera Integration
I used the **cordova-plugin-camera** to interact with the camera hardware.
* Flow: Tap the protile picture > Choose **Take a Photo** or **Choose a Photo** > Device Camera UI > Capture Photo > Display & Store.

## 5. Device Feature Integration
Apache Cordova serves as a bridge between the browser engine and native mobile APIs. JavaScript calls **navigator.camera.getPicture()**, which invokes native Java/Swift drivers to execute native hardware operations.

## 6. Image Handling
The plugin captures raw camera output, converts it to a **DATA_URL** (Base64 JPEG), assigns it directly to **<img id="profile-image">**, and writes the string to **localStorage.setItem('profilePicture', data)**.

## 7. Error Handling
* **Permission Denial / Error**: Triggered callbacks alert user gracefully with actionable text without crashing the app context.
* **User Cancellation**: Handled gracefully within `onCameraError` by detecting cancellation status codes, keeping existing images active without visual glitches.

## 8. Responsive Design
I applied **@media (min-width: 1500px)** rules to switch my layout from a stacked single column into a multi-column desktop grid for wider displays. I also included the meta viewport tag (width=device-width, initial-scale=1) to adjust scaling properly on mobile browsers.

## SCREENSHOTS

# Update Profile Picture
![UpdatedPfp](C:\ROAMOBDEV\www\screenshots\UpdatedPfp.png)

# Tap Profile Picture > Choose Take a Photo or Choose a Photo/Change Profile Picture
![ChangePfp](C:\ROAMOBDEV\www\screenshots\ChangePfp.png)

# Take a Photo
![TakePhoto](C:\ROAMOBDEV\www\screenshots\TakePhoto.png)

# Upload/Retake/Cancel Photo
![UploadPhoto](C:\ROAMOBDEV\www\screenshots\UploadPhoto.png)

## 9. How to Run
npm install -g cordova

cordova platform add android

cordova build android

cordova emulate android

cordova run android

**Other way** to run  

npx server

open either local or network !!

