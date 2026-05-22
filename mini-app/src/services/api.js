const API_URL = 'https://intimal-hymnologic-sachiko.ngrok-free.dev/api';

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(method, path, body = null) {
    const opts = { method, headers: this.getHeaders() };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${this.baseUrl}${path}`, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Request failed');
    }
    return res.json();
  }

  // Auth
  guestLogin() {
    return this.request('POST', '/auth/guest');
  }

  login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  }

  register(email, password, first_name = '') {
    return this.request('POST', '/auth/register', { email, password, first_name });
  }

  getMe() {
    return this.request('GET', '/auth/me');
  }

  linkTelegram(telegramId) {
    return this.request('PUT', '/auth/link-telegram', { telegram_id: telegramId });
  }

  // Notes
  getNotes() {
    return this.request('GET', '/notes/');
  }

  createNote(noteData) {
    return this.request('POST', '/notes/', noteData);
  }

  deleteNote(noteId) {
    return this.request('DELETE', `/notes/${noteId}`);
  }
}

const api = new ApiService();
export default api;
