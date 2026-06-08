GlobalBank Customer Payment Portal
This project is a secure, full-stack financial application designed for international SWIFT transactions. It features a role-based access control (RBAC) system with dedicated portals for both customers and bank staff.

🚀 Getting Started
To run this project locally, follow the steps below.

Prerequisites
You must have Node.js installed on your machine. You can download the latest version from nodejs.org.

Installation
Clone the repository:

Bash
git clone https://github.com/ST10225793/GlobalBank-Customer-Payment-Portal.git
Navigate to the frontend directory:

Bash
cd frontend-customer
Install dependencies:
The project requires various Node.js modules to function. Install them using:

Bash
npm install
Note: This will recreate the node_modules folder locally.

Running the Application
Once the dependencies are installed, you can start the development server:

Bash
npm start
This will launch the application at http://localhost:3000.

🔐 Security & Compliance
This application is built with security as a priority. Key measures include:

No Public Registration: User accounts are provisioned exclusively by system administrators.

Input Whitelisting: All forms are validated using yup and RegEx to prevent injection and malformed data.

Encrypted Transit: Traffic is secured via SSL/TLS.

Authentication: Multi-domain authentication logic is enforced to isolate Customer (@banking.local) and Staff (@apdsbank.com) access.

🛠 Tech Stack
Frontend: React.js, Tailwind CSS, React Router, React Hook Form

Authentication: Firebase Authentication

Database: Firestore (NoSQL)

Validation: Yup
