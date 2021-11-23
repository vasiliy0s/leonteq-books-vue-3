export default abstract class ApiClient {
  private baseUrl = 'https://fakerestapi.azurewebsites.net/api/v1'

  protected async fetchJson<T>(method: string, endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`
    const res = await fetch(url, { method })
    return res.json()
  }
}