import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VideoVisualizations extends BaseSchema {
  protected tableName = 'video_visualizations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('video_id').references('videos.id')
      table.integer('origin_id').references('origins.id')
      table.bigInteger('count')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
