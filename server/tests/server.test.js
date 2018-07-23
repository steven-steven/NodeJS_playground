const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server'); 
const {Todo} = require('./../models/todo'); 

const todos = 
[{
    _id: new ObjectID(), 
    text:'first Task'
}, {
    _id: new ObjectID(), 
    text:'second Task',
    completed: true,
    completedAt: 1235
}];

describe('REST API Todos Test Suite', ()=>{

    beforeEach((done)=>{

        Todo.remove({}) //wipe all todos
            .then(()=>{
                return Todo.insertMany(todos);
            }).then(()=>done());
    })

    describe('POST /todos', ()=>{

        it('Should create new todo', (done)=>{  //done: asynchronous
            let text = 'Test todo text';

            //supertest: test express REST API
            request(app).post('/todos')
                .send({text})
                .expect(200)
                .expect((res)=>{
                    expect(res.body.text).toBe(text);   //expect
                })
                .end((err,res)=>{                       //instead of .end(done), we want to test database(async)
                    if(err){
                        return done(err);
                    }
                    Todo.find({text}).then((todos)=>{
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((e) => done(e))

                })
        })

        it('Should not create Todo with invalid body data', (done)=>{
            
            request(app).post('/todos')
                .send({})
                .expect(400)
                .end((err,res)=>{
                    if(err){
                        return done(err);
                    }
                    Todo.find().then((todos)=>{
                        expect(todos.length).toBe(2);
                        done();
                    }).catch((e) => done(e))

                })
        })

    })

    describe('GET /todos', ()=>{

        it('Should get all (2) todos', (done)=>{
            //supertest: test express REST API
            request(app).get('/todos')
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todos.length).toBe(2);   //expect
                })
                .end(done)

        })

    })

    describe('GET /todos/:id', ()=>{

        it('should return Todo doc with id match', (done)=>{
            //supertest: test express REST API
            request(app).get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todo.text).toBe(todos[0].text);   //expect
                })
                .end(done)

        })

        it('should return 404 if todo not found (valid objId format)', (done)=>{
            let hexId = new ObjectID().toHexString();
            //supertest: test express REST API
            request(app).get(`/todos/${hexId}`)
                .expect(404)
                .end(done)

        })

        it('should return 404 if invalid ObjectId', (done)=>{
            //supertest: test express REST API
            request(app).get('/todos/123somewrongidformat')
                .expect(404)
                .end(done)

        })

    })

    describe('DELETE /todos/:id', ()=>{

        it('should remove a Todo', (done)=>{
            var hexId = todos[1]._id.toHexString();
            //supertest: test express REST API
            request(app).delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todo._id).toBe(hexId);   //expect
                })
                .end((err,res)=>{
                    if(err){
                        return done(err);
                    }
                    Todo.findById(hexId).then((todo)=>{
                        expect(todo).toBeFalsy();
                        done();
                    }).catch((e)=>done(e));
                })

        })

        it('should return 404 if todo not found (valid objId format)', (done)=>{
            let hexId = new ObjectID().toHexString();
            //supertest: test express REST API
            request(app).delete(`/todos/${hexId}`)
                .expect(404)
                .end(done)

        })

        it('should return 404 if invalid ObjectId', (done)=>{
            //supertest: test express REST API
            request(app).delete('/todos/123somewrongidformat')
                .expect(404)
                .end(done)

        })
    })

    describe('PATCH /todos/:id', ()=>{

        it('should update a Todo', (done)=>{
            var hexId = todos[0]._id.toHexString();
            var text = "new Text"

            //supertest: test express REST API
            request(app).patch(`/todos/${hexId}`)
                .send({completed:true, text})   //send update request
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todo.text).toBe(text);   //expect
                    expect(res.body.todo.completed).toBe(true);
                    expect(typeof res.body.todo.completedAt).toBe('number');
                })
                .end(done)
        });

        it("should clear 'completedAt' when Todo not completed", (done)=>{
            var hexId = todos[1]._id.toHexString();
            var text = "new Text"

            //supertest: test express REST API
            request(app).patch(`/todos/${hexId}`)
                .send({completed:false, text})   //send update request
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todo.text).toBe(text);   //expect
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toBeFalsy();
                })
                .end(done)
        });
    })


}).timeout(0);