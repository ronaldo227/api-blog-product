# Utils: Funções Utilitárias e Helpers

Esta pasta contém funções utilitárias e helpers para logging, formatação e outras tarefas auxiliares do projeto.

## Principais arquivos
- `logger-modern.ts`: Logger estruturado com Winston, suporta múltiplos níveis e formatos.
- `logger.ts`: Logging e debug customizado usando o pacote debug.

## Exemplos de uso
```typescript
// Logger moderno (Winston)
import logger from '../utils/logger-modern';
logger.info('Servidor iniciado');

// Logger customizado (debug)
import { Logger } from '../utils/logger';
Logger.info('server', 'Servidor rodando', { port: 4444 });
```

## Boas práticas
- Use os utilitários para centralizar lógica repetitiva e helpers.
- Prefira logger estruturado para produção e debug para desenvolvimento.
- Documente helpers complexos neste README.

---
Consulte este README para exemplos e padrões antes de criar novos utilitários.
