import { tool } from "@langchain/core/tools"
import { z } from "zod"

const multiply = tool(
  ({ a, b }) => {
    /**
     * Multiply two numbers.
     */
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number()
    }),
  }
);



const sum = tool(
  ({ a, b }) => {
    /**
     * Sum a and b.
     *
     * @param a - first number
     * @param b - second number
     * @returns The product of a and b
     */
    return a + b;
  },
  {
    name: "sum",
    description: "Sum two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);
const sumResult = await sum.invoke({ a: 2, b: 3 });
const multiplyResult = await multiply.invoke({ a: 4, b: 4 });
console.log(sumResult);
console.log(multiplyResult); 