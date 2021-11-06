import { validator } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'

import { BaseRepository } from './BaseRepository'
import VideoIndexValidator from 'App/Validators/VideoIndexValidator'
import Video from 'App/Models/Video'

class VideoRepository extends BaseRepository {
  public async index(payload?: any) {
    const filters = await validator.validate({
      ...new VideoIndexValidator(),
      data: payload || {},
    })

    const query = Video.query()

    if (filters.id) {
      query.whereIn('id', filters.id)
    }

    if (filters.fields) {
      query.select(filters.fields.map(string.snakeCase))
    }

    if (filters.include?.includes('images')) {
      query.preload('images', (q) => q.select('id', 'name', 'src', 'alt'))
    }

    if (filters.include?.includes('views')) {
      query.preload('views', (q) => q.select('id', 'source', 'count'))
    }

    if (filters.include?.includes('comments')) {
      query.preload('comments')
    }

    query.orderBy(
      string.snakeCase(filters.orderBy || 'created_at'),
      filters.orderDesc ? 'desc' : 'asc'
    )

    if (this.permissions && !this.permissions.includes('admin')) {
      query.withScopes((s) =>
        s.isVisibleTo([...(this.permissions as string[]), 'visibility:public'])
      )
    }

    const result = await query.paginate(filters.page || 1, filters.limit)

    return result.serialize()
  }
}

export default new VideoRepository()
