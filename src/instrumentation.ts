export async function register() {
  const { initializeServer } = await import('@server/index');

  await initializeServer();
}
