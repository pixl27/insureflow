"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_js_1 = require("./app.module.js");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    app.enableCors();
    const port = 4006;
    await app.listen(port);
    console.log(`DOCUMENTS service running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map