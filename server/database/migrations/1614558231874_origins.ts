import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Origins extends BaseSchema {
  protected tableName = 'origins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
