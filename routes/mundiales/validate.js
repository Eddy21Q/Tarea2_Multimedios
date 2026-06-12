export function validate(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues.map((issue) => ({
        campo: issue.path.join('.') || 'valor',
        mensaje: issue.message
      }))
    };
  }

  return { ok: true, data: result.data };
}
