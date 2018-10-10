const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");

const expect = chai.expect;
chai.use(chaiHttp);

describe("recipes list", function(){
    beforeEach(()=>{
        return runServer();
    });

    afterEach(() => {
        return closeServer();
    });

    it("should return recipes list on GET ", () => {
        return chai.request(app)
                .get("/recipes")
                .then(function(res){
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.length).to.be.at.least(1);

                    const expectedKeys = ["name", "ingredients"];

                    res.body.forEach(item =>{
                        expect(item).to.be.a('object');
                        expect(item).to.include.keys(expectedKeys)
                    })
                })
    });

    it("should add a recipe on POST" , () =>{
        const newRecipe = {"name":"icecream", "ingredients":["milk", "cream", "sugar"]};
        return chai.request(app)
                .post("/recipes")
                .send(newRecipe)
                .then((res) =>{
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.include.keys("name", "ingredients");
                    expect(res.body).to.deep.equal(Object.assign(newRecipe,{id:res.body.id}))
                })
    })

    it("should update a recipe on PUT", () =>{
        const updated = {
            "name":"icecream", "ingredients":["milk", "heavy cream", "sugar"]
        }

        return chai.request(app)
            .get("/recipes")
            .then(function(res){
                updated.id = res.body[0].id;
                return chai.request(app)
                    .put(`/recipes/${updated.id}`)
                    .send(updated)
            })
            .then(res => {
                console.log(res.body);
                expect(res).to.have.status(204);
            })
    })

    it("should delete a recipe on delte", () =>{

        return chai.request(app)
            .get("/recipes")
            .then(function(res){
                idToDelete = res.body[0].id;
                return chai.request(app)
                        .delete(`/recipes/${idToDelete}`)
            })
            .then( (res) => {
                expect(res).to.have.status(204)
            })

    })
})