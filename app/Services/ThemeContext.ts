import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepository from 'App/Repositories/VideoRepository'

export class ThemeContext {
  public user?: Record<string, any>
  public permissions: string[] = []

  public response: HttpContextContract['response']

  public videos: Record<string, any> = {}
  public path: string
  public fullPath: string
  public query: Record<string, any>

  public static async mount({ auth, request, response }: HttpContextContract) {
    const instance = new this()

    instance.response = response
    instance.path = request.url()
    instance.fullPath = request.url(true)
    instance.query = request.qs()

    if (auth.user) {
      instance.user = auth.user.serialize()
      instance.permissions = (await auth.user.findPermissions()).map((p) => p.name)
    }

    const repository = VideoRepository.withPermissions(instance.permissions)

    instance.videos = {
      index: repository.index.bind(repository),
      // show: repository.show.bind(repository),
    }

    return instance
  }
}
