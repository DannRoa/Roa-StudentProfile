git# Student Profile Application ROA ITCC 41 A

## Project Description 

This is a mobile-friendly Student Profile application built with HTML and CSS for ITCC 41 Mobile Development. It highlights my personal background, interests, and technical skills as a 3rd-year IT student.

## Application Structure
Header: Displays my profile, name, and course.
Navigation Menu: Quick tap options (About and Skills)
About Section: My introduction, short bio, educational background and personal interests.  
Skills Section: My lists of technical skills and programming languages.  
Footer: Displays copyright.

## Responsive Design
I applied @media (min-width: 1500px) rules to switch my layout from a stacked single column into a multi-column desktop grid for wider displays.

I included the meta viewport tag (width=device-width, initial-scale=1) to adjust scaling properly on mobile browsers.

## UI/UX Principles
Responsive Layout: I stacked elements in a single column on mobile screens and automatically switch to side-by-side grids on wider desktop screens.  
Mobile-Friendly Spacing: I used flexible padding and gap spacing so content is easy to tap.
Appropriate Typography: I used clean system fonts with readable text sizes so every section is easy to read.  
Clear Visual Hierarchy: I made key titles pop using bold text sizes and light blue cards to group related details clearly.  
Usable Controls: I highlighted navigation buttons smoothly when hovered over so users know what they are clicking.  
Basic Accessibility: I used clear HTML labels (<nav>, <footer>) and descriptive image tags so screen readers can easily read my content.  
Consistent Design: I kept a uniform look across the app using soft backgrounds, dark footers, and matching rounded cards. 

## Navigation
I used <a=href> to allow users to jump directly between my About and Skills sections.

## Steps to execute
Open command prompt inside your project folder and run:

cordova platform add android
cordova build android

Step 2: Open the Project in Android Studio
Navigate to your project folder

Step 3: Run the Application

Set Up a Virtual Device (Emulator):

Select a phone model and click next.

Launch the App

### Screenshots 

**I didn't have enough storage(PC) to download the Tablet and Desktop emulator in Android Studio, so I just ran it on Mobile Simulator :<**

#### Mobile 
![Mobile Layout](./www/screenshots/roa_phone.png)

#### Tablet 
![Tablet Layout](./www/screenshots/roa_tablet.png)

#### Desktop
![Desktop Layout](./www/screenshots/roa_desktop.png)

