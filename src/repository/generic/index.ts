import { inject, injectable, unmanaged } from 'inversify';
import { Schema, Document, Model, SchemaDefinition, ClientSession } from 'mongoose';
import { MongoDbService } from '../../services/mongodb';
import { TYPES } from '../../constants';

export interface IRepository<TEntity> {
    create(doc: TEntity): Promise<TEntity>;
    findAll(): Promise<TEntity[]>;
    findOne(criteria: object, session?: ClientSession): Promise<TEntity | null>;
    findById(id: string): Promise<TEntity | null>;
    update(id: string, doc: TEntity, session?: ClientSession): Promise<TEntity | null>;
}

/**
 * This Generate Repository defines all basic required methods for MongoDB operations,
 * e.g. save, findAll, findOne
 * @method save
 * @method findAll
 * @method findOne
 * @method findById
 * @method update
 */
@injectable()
export class GenericRepository<TEntity, TModel extends Document>
    implements IRepository<TEntity> {

    private name: string;
    protected model: Model<TModel>;

    public constructor(
        @inject(TYPES.MongoDbService) mongodb: MongoDbService,
        @unmanaged() name: string,
        @unmanaged() schemaDefinition: SchemaDefinition
    ) {
        this.name = name;
        const schema = new Schema(schemaDefinition, { collection: this.name });
        this.model = mongodb.getClient().model<TModel>(this.name, schema);
    }

    /**
     * Save a document into the database
     * @param doc
     * @returns Promise of TEntity
     */
    public async create(doc: TEntity): Promise<TEntity> {
        const result = await this.model.create(doc);
        return this.readMapper(result);
    }

    /**
     * Find all documents in the database
     * @returns Promise of list of TEntity
     */
    public async findAll(): Promise<TEntity[]> {
        const results = await this.model.find();
        return results.map(res => this.readMapper(res));
    }

    /**
     * Find one document in the database based on the criteria supplied
     * @param criteria
     * @returns Promise of TEntity
     */
    public async findOne(criteria: object, session?: ClientSession): Promise<TEntity | null> {
        const result = await this.model.findOne(criteria).session(session || null);
        if (!result) {
            return null;
        } else {
            return this.readMapper(result);
        }
    }

    /**
     * Find one document in the database based on the id
     * @param id
     * @returns Promise of TEntity
     */
    public async findById(id: string): Promise<TEntity | null> {
        const result = await this.model.findById(id);
        if (!result) {
            return null;
        } else {
            return this.readMapper(result);
        }
    }

    /**
     * Update a document in the database based on the id.
     * @param id
     * @param doc
     * @param session
     * @returns Promise of TEntity
     */
    public async update(id: string, doc: TEntity, session?: ClientSession): Promise<TEntity | null> {
        const result = await this.model.findByIdAndUpdate(id, { $set: doc });
        if (!result) {
            return null;
        } else {
            return this.readMapper(result);
        }
    }

    /**
     * Transform an object from Mongoose Document to TypeScript object
     * @param model
     * @returns TEntity
     */
    protected readMapper(model: TModel): TEntity {
        const obj: any = model.toJSON();
        return <TEntity> {
            ...obj
        };
    }
}