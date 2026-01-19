# 🤝 Shared Workspace Package

This package contains common logic and TypeScript definitions used by both the **frontend** and **backend**.

## 📦 Contents
- **Types**: Interfaces for `Article`, `ArticleInput`, etc.
- **Validation**: Shared constants for character limits (Title/Content).

## 🚀 Usage
Install in any workspace app:
`pnpm add @sports-app/shared@workspace:*`

Import into your code:
```typescript
import { Article } from "@sports-app/shared";