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
        call.response.headers.appendIfAbsent("Content-Type", "application/json")
        val tasks = database.taskList()
        call.application.log.debug("Sending {} tasks", tasks.size)
        call.respond(HttpStatusCode.OK, tasks)
      }

      get("/response") {
        call.respond(TodoTaskResponse(database.taskList()))
      }

      post {
        val task = call.receive<TodoTask>()
        call.application.log.debug("Received task: {}", task)
        database.insertTask(task).guard {
          call.respond(HttpStatusCode.BadRequest, it.message)
          return@post
        }

        call.application.log.debug("Inserted task: {}", task)

        call.response.headers.appendIfAbsent("Content-Type", "application/json")
        call.respond(HttpStatusCode.OK, task)
      }

      route("/{id}") {
        get {
          val id = call.parameters["id"]!!
          val task = database.getTask(id).guard {
            call.respond(HttpStatusCode.NotFound, it.message)
            return@get
          }

          call.response.headers.appendIfAbsent("Content-Type", "application/json")
          call.respond(task)
        }

        delete {
          val id = call.parameters["id"]!!
          database.deleteTask(id).guard {
            call.respond(HttpStatusCode.NotFound, it.message)
            return@delete
          }

          call.application.log.debug("Deleted task: {}", id)

          call.response.headers.appendIfAbsent("Content-Type", "application/json")
          call.respond(HttpStatusCode.OK)
        }

        put {
          val task = call.receive<TodoTask>()
          call.application.log.debug("Received task: {}", task)
          database.updateTask(task).guard {
            call.respond(HttpStatusCode.NotFound, it.message)
            return@put
          }

          call.application.log.debug("Updated task: {}", task)

          call.response.headers.appendIfAbsent("Content-Type", "application/json")
          call.respond(HttpStatusCode.OK)
        }
      }
    }
  }
}
