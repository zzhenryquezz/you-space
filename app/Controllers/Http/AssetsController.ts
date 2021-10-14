import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
import Drive from '@ioc:Adonis/Core/Drive'
import { Space } from 'App/Services/SpaceService'
import { AssetData } from 'App/Listeners/AssetListener'

export default class AssetsController {
  public async importMap({ response }: HttpContextContract) {
    response.type('application/importmap+json')

    const assets = await Space.emit<AssetData[]>('asset:index')

    const imports = {}

    if (!assets) {
      return { imports }
    }

    assets.forEach((asset) => {
      imports[asset.name] = `/api/v1/assets/${asset.name}`
    })

    return {
      imports,
    }
  }

  public async show({ response, request }: HttpContextContract) {
    const name = request.params()['*'].join('/')

    const asset = await Space.emit<AssetData>('asset:show', name)

    if (!asset) {
      return response.notFound('Asset not found')
    }

    const exist = await Drive.exists(asset.filename)

    if (!exist) {
      return response.notFound('Asset not found')
    }

    const content = await Drive.get(asset.filename)

    response.type(path.extname(asset.filename))

    return content
  }
}
