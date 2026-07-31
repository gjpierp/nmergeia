import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NgacService } from './NgacService.js';

describe('NgacService Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    // Mock global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe registrar un usuario correctamente', async () => {
    const mockResponse = { ok: true, json: async () => ({ success: true, email: 'test@nmergeia.com' }), text: async () => 'OK' };
    vi.mocked(global.fetch).mockResolvedValue(mockResponse);

    const result = await NgacService.registerUser('test@nmergeia.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.email).toBe('test@nmergeia.com');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/register'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-app-code': 'nmergeia'
        })
      })
    );
  });

  it('debe iniciar sesión y almacenar el token JWT', async () => {
    // JWT mockeado con roles
    const payloadObj = { roles: ['ROLE_REGISTRADO'] };
    const mockJwt = 'header.' + btoa(JSON.stringify(payloadObj)) + '.signature';
    
    const mockResponse = {
      ok: true,
      json: async () => ({ token: mockJwt })
    };
    vi.mocked(global.fetch).mockResolvedValue(mockResponse);

    const result = await NgacService.loginUser('usuario@nmergeia.com', process.env.VITE_GUEST_PASSWORD || 'guestpass');
    
    expect(result.email).toBe('usuario@nmergeia.com');
    expect(result.token).toBe(mockJwt);
    expect(result.roles).toContain('ROLE_REGISTRADO');
    expect(localStorage.getItem('nmerge_jwt_token')).toBe(mockJwt);

    // Verificar payloads reales
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'usuario@nmergeia.com', password: process.env.VITE_GUEST_PASSWORD || 'guestpass' })
      })
    );
  });

  it('debe cargar el menú dinámico real enviando cabeceras correctas', async () => {
    const mockJwt = 'header.' + btoa(JSON.stringify({ roles: ['ROLE_REGISTRADO'] })) + '.signature';
    localStorage.setItem('nmerge_jwt_token', mockJwt);

    const mockMenuResponse = {
      ok: true,
      json: async () => ({
        data: {
          tree: [
            { codigo_tecnico: 'Comparar' },
            { codigo_tecnico: 'Historial' }
          ]
        }
      })
    };
    vi.mocked(global.fetch).mockResolvedValue(mockMenuResponse);

    const menu = await NgacService.getDynamicMenu(['ROLE_REGISTRADO'], true);

    expect(menu).toContain('Comparar');
    expect(menu).toContain('Historial');
    expect(menu).toContain('Landing'); // agregada por defecto
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/menu'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockJwt}`,
          'x-app-code': 'nmergeia'
        })
      })
    );
  });

  it('debe realizar login silencioso de invitado si no está autenticado al cargar el menú', async () => {
    const guestJwt = 'header.' + btoa(JSON.stringify({ roles: ['ROLE_INVITADO'] })) + '.signature';
    
    // Mockear dos llamadas: 1º /login (silencioso), 2º menu
    const loginRes = {
      ok: true,
      json: async () => ({ token: guestJwt })
    };
    const menuRes = {
      ok: true,
      json: async () => ({
        data: {
          tree: [
            { codigo_tecnico: 'Landing' },
            { codigo_tecnico: 'FAQ' }
          ]
        }
      })
    };
    
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(loginRes)
      .mockResolvedValueOnce(menuRes);

    const menu = await NgacService.getDynamicMenu([], false);

    expect(menu).toContain('FAQ');
    expect(localStorage.getItem('nmerge_jwt_token')).toBe(guestJwt);
  });

  it('debe evaluar correctamente los permisos con checkPermission', () => {
    localStorage.setItem('nmergeia_ngac_locked', 'true');
    
    const hasAdmin = NgacService.checkPermission('Ventas', ['ROLE_ADMINISTRADOR']);
    const hasGuest = NgacService.checkPermission('Ventas', ['ROLE_INVITADO']);
    
    expect(hasAdmin).toBe(true);
    expect(hasGuest).toBe(false);
  });
});
