package com.kronos.plugins

import com.kronos.model.TodoTask
import com.kronos.utils.FakeTaskDatabase
import com.kronos.utils.guard
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject

@Serializable
data class TodoTaskUpdateRequest(
  val task: TodoTask
)

@Serializable
data class TodoTaskResponse(
  val tasks: List<TodoTask>,
)

fun Application.configureRouting() {
  routing {
    route("/api") {
      taskApi()
    }
  }
}

fun Route.taskApi() {
  val database by inject<FakeTaskDatabase>()

  route("/task"){
    get {
      // TODO use real data
      call.respond(
        TodoTaskResponse(database.list())
      )
    }

    post {
      // TODO use real data
      val req = call.receive<TodoTask>()
      database.insertTask(req).guard {
        call.respond(HttpStatusCode.BadRequest, it.message)
        return@post
      }
      call.respond(HttpStatusCode.OK)
    }

    route("/{id}"){
      get {
        // TODO use real data
        val id = call.parameters["id"]!!
        val task = database.getTask(id).guard {
          call.respond(HttpStatusCode.NotFound, it.message)
          return@get
        }
        call.respond(TodoTaskResponse(listOf(task)))
      }

      delete {
        // TODO use real data
        val id = call.parameters["id"]!!
        database.deleteTask(id).guard {
          call.respond(HttpStatusCode.NotFound, it.message)
          return@delete
        }
        call.respond(HttpStatusCode.OK)
      }

      put {
        // TODO use real data
        val req = call.receive<TodoTaskUpdateRequest>()
        database.updateTask(req.task).guard {
          call.respond(HttpStatusCode.NotFound, it.message)
          return@put
        }
        call.respond(HttpStatusCode.OK)
      }
    }
  }
}
