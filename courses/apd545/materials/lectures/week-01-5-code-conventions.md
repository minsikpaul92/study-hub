Source: <Java Code Conventions (Sun Microsystems), Week 1 수업 자료 핵심 발췌>
# Week 1 · Java Code Conventions

## Why Have Code Conventions

> - 80% of the lifetime cost of a piece of software goes to maintenance.
> - Hardly any software is maintained for its whole life by the original author.
> - Code conventions improve the readability of the software, allowing engineers to understand new code more quickly and thoroughly.

## File Names and Organization

> - Java source `.java`, Java bytecode `.class`
> - Files longer than 2000 lines are cumbersome and should be avoided.
> - Each Java source file contains a single public class or interface.
> - Order: Beginning comments, Package and Import statements, Class and interface declarations.

## Order inside a Class

> 1. Class (static) variables: public, then protected, then package level, then private
> 2. Instance variables: same order
> 3. Constructors
> 4. Methods: grouped by functionality rather than by scope or accessibility

## Indentation and Line Length

> - Four spaces should be used as the unit of indentation.
> - Avoid lines longer than 80 characters.
> - Break after a comma. Break before an operator.

## Naming Conventions

> | Identifier Type | Rule | Examples |
> | --- | --- | --- |
> | Packages | all-lowercase | `com.sun.eng` |
> | Classes | nouns, mixed case, first letter of each word capitalized | `class Raster;` `class ImageSprite;` |
> | Interfaces | capitalized like class names | `interface RasterDelegate;` |
> | Methods | verbs, mixed case with the first letter lowercase | `run();` `getBackground();` |
> | Variables | mixed case with a lowercase first letter, short yet meaningful | `int i;` `float myWidth;` |
> | Constants | all uppercase with words separated by underscores | `static final int MIN_WIDTH = 4;` |
