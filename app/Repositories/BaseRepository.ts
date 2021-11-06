export class BaseRepository {
  public permissions?: string[]

  public withPermissions(permissions: string[]) {
    if (this.permissions) {
      throw new Error('Permissions already defined')
    }

    const instance = new (<any>this.constructor)()

    instance.permissions = permissions

    return instance as typeof this
  }
}
