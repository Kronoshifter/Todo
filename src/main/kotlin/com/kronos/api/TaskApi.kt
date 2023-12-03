package com.kronos.api

import com.kronos.configureApi
import com.kronos.model.TodoTask
import com.kronos.plugins.todoAuthentication
import com.kronos.database.TaskDatabase
import com.kronos.utils.guard
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.reflect.*
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

fun Application.configureTaskApi() {
  configureApi {
    taskApi()
  }
}

fun Route.taskApi() {
//  val database by inject<FakeTaskDatabase>()
  val database by inject<TaskDatabase>()

  todoAuthentication {
    route("/task") {
      get {
        // TODO use real data
        call.response.headers.appendIfAbsent("Content-Type", "application/json")
        call.respond(database.taskList())
      }

      get("/response") {
        call.respond(TodoTaskResponse(database.taskList()))
      }

      post {
        // TODO use real data
        val task = call.receive<TodoTask>()
        call.application.log.debug("Received task: {}", task)
        database.insertTask(task).guard {
          call.respond(HttpStatusCode.BadRequest, it.message)
          return@post
        }

        call.response.headers.appendIfAbsent("Content-Type", "application/json")
        call.respond(HttpStatusCode.OK, task)
      }

      route("/{id}") {
        get {
          // TODO use real data
          val id = call.parameters["id"]!!
          val task = database.getTask(id).guard {
            call.respond(HttpStatusCode.NotFound, it.message)
            return@get
          }

          call.response.headers.appendIfAbsent("Content-Type", "application/json")
          call.respond(task)
        }

        delete {
          // TODO use real data
          val id = call.parameters["id"]!!
          database.deleteTask(id).guard {
            call.respond(HttpStatusCode.NotFound, it.message)
            return@delete
          }

          call.response.headers.appendIfAbsent("Content-Type", "application/json")
          call.respond(HttpStatusCode.OK)
        }

        put {
          // TODO use real data
          val task = call.receive<TodoTask>()
          database.updateTask(task).guard {
            call.respond(HttpStatusCode.NotFound, it.message)
            return@put
          }

          call.response.headers.appendIfAbsent("Content-Type", "application/json")
          call.respond(HttpStatusCode.OK)
        }
      }
    }
  }
}
