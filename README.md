<h1><a href="https://main.d1onofnofz7ttl.amplifyapp.com/">Vacation Exploration</a></h1>
<p>
  Vacation Exploration is a website that helps people find the vacation that they would like to go on.
</p>
<p>
  Anyone that visits the website is able to view the about information and view any public vacations. A user can login and create an account that allows them to add friends and create and rate vacations that they have been on.
</p>
<h2>Technical Information</h2>
<p>
  This project uses Next.js and react.js as the basis for the frontend. Other packages and technologies used are:
  <ul>
    <li>AWS Amplify</li>
    <li>React-Redux</li>
    <li>Google Places scripts</li>
    <li>Axios</li>
    <li>HTML and CSS</li>
  </ul>
<h2>How to use this code</h2>
<p>
  This project is run concurrently with a node.js backend that is in
  <a href="https://github.com/cdoseck15/vacation-exploration-node">another repository</a> 
  on my account.
</p>
<p>
  You will have to have an account with Google setup to allow you to use Google Places and and OAuth Client ID that allows users to sign in using google.
</p>
<p>
  In addition to that you will require an AWS account if you wish to push this to AWS.
<p>
  In order to use this code you will need to create a private-constants.js file that contains the constants needed for the program to run. In the future this will be set to use environment variables and this file will no longer be used. The constants are as follows:
  <ul>
    <li>API_URL which is the url of the api</li>
    <li>GOOGLE_API_KEY</li>
  </ul>
</p>
