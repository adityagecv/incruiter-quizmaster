# **InCruiter QuizMaster**

InCruiter QuizMaster is an online quiz platform built using Next.js, designed to allow users to create quizzes, take tests, and view scores. It includes essential features like timers, multiple-choice questions, and result analysis.

## **Tech Stack**

- **Frontend**: Next.js, React.js, TypeScript
- **State Management**: Redux
- **UI Components**: ShadCN
- **Form Handling**: React Hook Form
- **Styling**: Tailwind CSS

## **Features**

✅ User authentication (login/register)  
✅ Quiz creation with multiple-choice questions  
✅ Timer-based quizzes  
✅ Score calculation and result analysis  
✅ Responsive UI

## **Requirements**

Before running the project, ensure you have the following installed:

- Node.js (>= 18.x.x)
- pnpm (I tested it using pnpm, but npm and yarn would be fine.)

## **Getting Started**

1. **Clone the repository**

   ```bash
   git clone https://github.com/adityagecv/incruiter-quizmaster
   cd incruiter-quizmaster
   ```

2. **Install dependencies**

   ```bash
   pnpm install  # or yarn install or npm install --legacy-peer-deps
   ```

3. **Run the development server**
   ```bash
   pnpm dev  # or yarn dev or npm run dev
   ```
   The app should be running at `http://localhost:3000`.

## **Building for Production**

To build the project for production, run:

```bash
pnpm build  # or yarn build or npm run build
```

This will generate an optimized version of the app in the `.next` folder.

## **License**

This project is open-source and free to use under the MIT License.
