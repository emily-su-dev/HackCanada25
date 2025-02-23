<img width="1440" alt="home" src="https://github.com/user-attachments/assets/138a7767-f843-4eae-9b61-8b3eec9b3c0f" />

## WHAT IS Sinker? 🪝
Sinker is a cybersecurity simulation testing platform that aids businesses in training employees to recognize phishing text messages, scam phone calls, and other threats. It periodically and randomly sends out AI-generated phishing attacks tuned specifically with employee company and position information. Sinker aims to facilitate the cybersecurity awareness training processes in companies, allowing employees to stay sharp and catch threats hook, line, and sinker.

## OUR INSPIRATION 💡
Cybersecurity is becoming an increasingly large threat, especially with the rise of Artificial Intelligence models allowing for realistic and targeted attacks by scammers. Businesses are at high-risk of cyber attacks, especially those that rely heavily on technology and loan out personal computer and mobile devices. Current cybersecurity awareness programs used by businesses send out spam emails to test employees, however, these are often mass-sent to all employees or very simple and obvious scams. Additionally, most cybersecurity programs focus on email scams over phone scams, which give employees time to stop and discuss the threat with others, where they may not be able to with a spontaneous phone call. Addressing these issues, Sinker allows account managers to send out spontaneous and targeted phishing alerts via email, text, and cell phone. Backed with the power of Google Gemini's AI, Sinker requires a name, email, work company and position, and phone number (if applicable) to send out personalized and individual phishing attacks specific to the employee's company and position. The results of these phishing attempts are stored in Sinker's database, and displayed to the account manager for their viewing and analysis.

<img width="1440" alt="Screenshot 2025-02-23 at 8 59 07 AM" src="https://github.com/user-attachments/assets/6a493530-dd70-4c6b-ae32-fa666793e27e" />

## FEATURES ⚙️
Multi-Channel Phishing Simulation: Sinker tests employees across multiple communication channels, including email, text, and phone calls, to ensure comprehensive cybersecurity training.
AI-Powered Targeted Attacks: Using Google Gemini AI, Sinker generates realistic phishing attempts tailored to each employee’s role and company, making scams more convincing and effective.
Realistic, Unpredictable Scenarios: Phishing attacks are sent at unpredictable times with personalized messaging, simulating real-world scams and testing employees’ ability to respond under pressure.
Comprehensive Tracking and Insights: All phishing attempts and employee responses are logged in a database, allowing account managers to analyze results, track performance, and strengthen security training.

## OUR TECH STACK 💻
Sinker is written in TypeScript with Next.js. React with Material UI components compose the frontend elements of our project. NextAuth.js powers our Google user authentication, and Prisma ORM is used to host a PostgreSQL database for our user data.
Sinker is fully deployed using Heroku at https://sinker-2019d3eb5115.herokuapp.com/. Feel free to make an account and start adding employees to test it out! 

<img width="1440" alt="Screenshot 2025-02-23 at 9 01 46 AM" src="https://github.com/user-attachments/assets/66e4e18f-5abe-482f-a334-f0b34bd92729" />

## THE FUTURE OF Sinker 💫
In the future, we would like to implement an automated scheduling system where Sinker will run a workflow to choose attacks and individuals to run, reducing the workflow burden on the account manager. We would also love to flesh out our attacks to make them even more realistic by sending out emails, SMS, and phone calls from randomized addresses. Finally, we would also like to add a better analysis of our phishing attempts. For example, we would like to get better metrics on how our users are interacting with call and sms threats, like analyzing call duration or interpreting messages back and forth from the user.

## CHALLENGES 🏆
The first challenge we faced was perhaps the hardest part of any hackathon... finding an idea. We spent over 6 hours cycling through different ideas before we came up with Sinker. By this point, we had used all of the first night, but the determination from finding an idea that clicked was enough to power us through the last 24 hours!
One of the biggest challenges we faced while developing Sinker was authenticating the user. We wanted a way to ensure user data could be maintained across sessions while maintaining a light database system. We used NextAuth.js to reach these goals, but the integration with Next brought out a whole new ring of troubles. No one on the team was super familiar with Next.js before, but we can say for sure that we learned a whole lot more after developing Sinker!
