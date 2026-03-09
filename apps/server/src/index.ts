export interface Env {
  ROOMS: DurableObjectNamespace;
}

export class GameRoom {
  constructor(
    readonly ctx: DurableObjectState,
    readonly env: Env
  ) {}

  fetch(): Response {
    return Response.json({
      ok: true,
      room: true
    });
  }
}

export default {
  fetch(): Response {
    return Response.json({ ok: true, service: "cornerfall-server" });
  }
};
