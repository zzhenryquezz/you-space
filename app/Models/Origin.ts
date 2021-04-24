import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Item from './Item'
import OriginMeta from './OriginMeta'
export default class Origin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @hasMany(() => OriginMeta, {
    foreignKey: 'originId',
  })
  public metas: HasMany<typeof OriginMeta>

  @hasMany(() => User, {
    foreignKey: 'originId',
  })
  public users: HasMany<typeof User>

  @hasMany(() => Item, {
    foreignKey: 'originId',
  })
  public Item: HasMany<typeof Item>

  @beforeDelete()
  public static async beforeDelete(origin: Origin) {
    await origin.related('users').query().delete()
  }
}
