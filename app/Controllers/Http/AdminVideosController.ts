import Application from '@ioc:Adonis/Core/Application'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { v4 as uuid } from 'uuid'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'
import File, { FileTypes } from 'App/Models/File'
import Origin, { OriginTypes } from 'App/Models/Origin'
import OriginProvider from 'App/Services/Origin/OriginProvider'
import OriginMetadata from 'App/Models/OriginMetadata'

export default class VideosController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const offset = (page - 1) * limit
    const origins = await Origin.query().where('type', OriginTypes.YouTube)

    await Promise.all(origins.map(async (o) => OriginProvider.register(o, page)))

    const { sum } = await OriginMetadata.query().sum('total_videos').firstOrFail()
    const totalVideos = Number(sum) || 0

    const videos = await Video.query().offset(offset).limit(limit).orderBy('created_at', 'desc')

    return {
      data: videos,
      meta: {
        total: totalVideos,
        pages: Math.ceil(totalVideos / limit),
      },
    }
  }

  public async store({ request }: HttpContextContract) {
    const { name, video, thumbnail } = await request.validate(VideoValidator)

    const originMain = await Origin.firstOrCreate({
      type: OriginTypes.Main,
      name: 'local',
    })

    const videoFilename = `${uuid()}.${video.extname}`

    await video.move(Application.tmpPath('uploads'), {
      name: videoFilename,
    })

    const file = await File.create({
      type: FileTypes.Video,
      filename: videoFilename,
      extname: video.extname,
    })

    let image: File | null = null

    if (thumbnail) {
      const filenameThumbnail = `${uuid()}.${thumbnail.extname}`

      await thumbnail.move(Application.tmpPath('uploads'), {
        name: filenameThumbnail,
      })

      image = await File.create({
        type: FileTypes.Image,
        filename: filenameThumbnail,
        extname: thumbnail.extname,
      })
    }

    const create = await Video.create({
      id: `${originMain.id}-${file.id}`,
      videoId: String(file.id),
      originId: originMain.id,
      originData: {
        ...file.serialize(),
        name,
        thumbnail: image ? image.serialize() : undefined,
      },
    })

    const { count } = await originMain.related('videos').query().count('id').first()

    await originMain.related('metadata').updateOrCreate(
      {
        originId: originMain.id,
      },
      { originId: originMain.id, totalVideos: count }
    )

    return create
  }

  public async updateAll({ request }: HttpContextContract) {
    const { videos } = await request.validate({
      schema: schema.create({
        videos: schema.array([rules.minLength(1)]).members(
          schema.object().members({
            id: schema.string(),
            visibility_id: schema.number.optional(),
          })
        ),
      }),
    })

    return await Video.updateOrCreateMany('id', videos)
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    return video.delete()
  }
}
