import { ServerApplication } from './risk/presentation/http/server';

(async (): Promise<void> => {
  await runApplication();
})();

async function runApplication(): Promise<void> {
  const serverApplication = new ServerApplication();
  await serverApplication.run();
}
