---
output:
  html_document: default
  pdf_document: default
---
#SightLife Data: Turning Data Points into Human Stories

Updated: June 1, 2017

###Code repository location:

https://github.com/dcm93/skeleton2/tree/hideNavbar

###Link to live website deployment:

http://students.washington.edu/stants5/SightLife/

###Project Overview

Successful data communication inspires action. In India, where nearly half of the world’s corneal blind population lives, policy makers must be persuaded to implement policy change to more efficiently treat these citizens. Sponsored by SightLife, SightLife Data is an information visualization tool that dynamically demonstrates the potential impact that policy change can have. SightLife will be able to use this site to create advocates and inspire policy change that will help the organization accomplish their mission of eradicating corneal blindness worldwide by the year 2040.

####Contact Information:

  - Mayowa Aina - mayowa.aina26@gmail.com
  - Yvonne Ingles - ydingles@uw.edu.com
  - Domenica Carolina Mata Rodriguez - dcm93@uw.edu
  - Sarah Stanton - sarah.g.stanton@gmail.com

##Contents

  - Summary of Technology Decisions (libraries used)
  - Components that can be changed
  - Updating the CSV File
  - Future functionality

##Summary of Technology Decisions

***a summary of the major technology decisions we made, including why you chose the stack you did***

###Libraries used:

#####Mapbox libraries:

  - Mapbox-gl.js ||  Mapbox-gl.css
  - Version 0.37.0
  - https://www.mapbox.com/mapbox-gl-js/api/
  - A JavaScript library that renders interactive maps. Provides the styling for the maps.
  - Used to make the map and bind the data file.

#####Bootstrap libraries:

  - Bootstrap.min.css  || bootstrap.min.js
  - Version 4.0.0-alpha.6
  - https://v4-alpha.getbootstrap.com/
  - A HTML, CSS and JS framework to build responsive mobile friendly web pages.

#####JQuery library:

  - Jquery.min.js
  - Version 3.2.0
  - http://jquery.com/
  - A JavaScript library for HTML document traversal and manipulation, event handling, animation, and Ajax.
  Used to handle:
  - the communication between the navigation bar and scrolling within the page

#####D3 libraries:

- d3.min.js
- Version 4.0
- https://github.com/d3/d3/wiki
- A JavaScript library for  visualizing data.
- Used to make the line chart that displays state specific policy implementation data within the map area.
 
- d3-legend.js
- Version 4.0
- http://d3-legend.susielu.com/
- A JavaScript library used to make chart legends.
- Used to render the map legend defining the line chart colors and map gradients.

#####Other: 

  - Tether.min.js
  - Version 1.3.3
  - http://tether.io/docs/
  - A positioning engine to make overlays, tooltips and dropdowns.

###Components that can be changed

The following tags are used for Search Engine Optimization and for devices that utilize accessibility tools (ie. in place of images, devices display the <alt> tag that corresponds to the image). Each of these components should be updated whenever page elements are changed.

`<title>insert title</title>`

Title tags are used in search engine results. Each web page should have it’s own unique title describing what the page is about.

Learn more here: https://moz.com/learn/seo/title-tag

`<meta name=“description” content=“insert description here”>`

Description tags are used in search engine results to display a snippet of the page content. They should be no longer than 160 characters and be unique to each page.

Learn more here: https://moz.com/learn/seo/meta-description

`<alt="insert description here">`

Alt tags are used to describe the appearance and function of an element on a page for accessibility.

Learn more here: https://moz.com/learn/seo/alt-text

###Updating the CSV file

Notes on final.csv:

1. Combined is MN + First Person Consent
2. MN1 is MN + baseline
3. Combined1 is Combined + baseline
4. Year 1 calculates estimates using population numbers from 2017, year 2 from 2018, and so on
5. Population and urbanPop are 2017 numbers

Notes on baseline rates data file:

1. Notification Rate (Mandatory Notification) is set to 25% in the HCRP & MN Potential Donors tab
2. Numbers in the policy implementation tab are used for baseline column in final.csv

Notes on MN rates data file:

1. Notification Rate (Mandatory Notification) is set to 40% in the HCRP & MN Potential Donors tab
2. Numbers in the policy implementation tab are used for MN column in final.csv

Notes on combined rates data file:

1. Notification Rate (Mandatory Notification) is set to 65% in the HCRP & MN Potential Donors tab
2. Numbers in the policy implementation tab are used for combined column in final.csv

To change the data that is displayed in the line chart the csv file containing the state names and numbers can be modified:

1. Open the CSV file in excel
2. Locate the Year, State, and the Category to be changed
3. Save the CSV file.

The line chart will be updated with the new data once the file is saved, and file is updated on the server. Adding additional columns or changing the column names will require code modification. 

###Future functionality

Make the html reusable, depending on what country is selected a different CSV is being fed into the d3 read csv function. This would allow for the html to be repopulated depending on what country is selected.
 
Right now, we don’t have a server side solution that will be holding the CSV files.
There is no database that can be queried to hold these CSV files.
 
There is a need to create a server side solution, that would create the communication between the site and the database.
 
The database is a storage of the CSV files that would contain information of each country. As of now, we are providing a reusable front end solution that defaults to a CSV that contains information on India.

