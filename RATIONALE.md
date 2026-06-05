# How TypeScript’s type system helped you catch errors or improve code quality 

1. Typescript helps me catch errors at compile time before the code runs. With JavaScript, many bugs only surface at runtime when a real user hits them. TypeScript catches them while I am still writing code.

2. Typescript's union types help restrict invalid values. Instead of accepting any string, I can restrict a variable to only the values that make sense. For example, the Priority variable in my code accepts only valid values like "High", "Medium", or "Low".

3. When I rename or change a type, TypeScript immediately flags every place in the codebase that needs to be updated. This helped save me time from manually searching every usage.

# Your project structure decisions and how you organized modules with import/export 

I decided to structure my project in layers based on purpose:

1. index.html provides the structure
2. src/main.ts connects everything together
3. src/types/ and src/data/ contain the type definitions and raw data for testing
4. src/utils/ contains business logic
5. src/dom/ contains DOM manipulation

I set it up this way so dependencies only flow downward to prevent circular imports. I used named exports in the TypeScript files to make it clear what each file provides. I used 'import type' for types and regular 'import' for values and functions. I also used relative paths for all imports.

# How Vite’s dev server and build pipeline supported your development workflow 

Vite's dev server and build pipeline helped speed up my development. During development, Vite's Hot Module Replacement feature enabled me to validate new updates quickly. For example, when I make formatting updates and save the main.css file, the new styles appear instantly in the browser for me to review. Vite accelerated my production builds by removing unused code and minifying TypeScript and CSS files.

# Which JavaScript patterns (destructuring, spread, closures, array methods) you found most useful and why 

I found destructuring and array method most useful in this project.

1. Destructuring lets me unpack values from objects or arrays into named variables in a single line instead of accessing each property separately. For example, I used object destructuring in buildRowHTML in renderTable.ts and array destructuring in formatDisplayDate in taskUtils.ts. Destructuring reduces repetition and immediately shows which fields a function actually uses.

2. I used array methods extensively in this project. For example, I used .filter() method to keep elements matching a condition so a user can filter tasks by status, priority, and search. I also used .sort() method to reorder elements so a user can sort tasks by any column.
