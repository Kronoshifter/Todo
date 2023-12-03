package com.kronos.database

import com.github.michaelbull.result.*
import com.kronos.model.TodoTask
import com.kronos.utils.putIfPresent
import io.github.serpro69.kfaker.faker
import kotlinx.serialization.Serializable
import java.time.Duration
import java.time.Instant


sealed interface Database {
  fun taskList(): List<TodoTask>
  fun getTask(id: String): Result<TodoTask, DatabaseError>
  fun insertTask(task: TodoTask): Result<Boolean, DatabaseError>
  fun updateTask(task: TodoTask): Result<Boolean, DatabaseError>
  fun deleteTask(id: String): Result<Boolean, DatabaseError>
}

// This is an abstraction layer for the database
// For the time being, it allows me to simulate a real database
// without having to set one up
open class TaskDatabase : Database {
  protected open val tasks = mutableMapOf<String, TodoTask>()

  override fun taskList(): List<TodoTask> {
    return tasks.values.toList()
  }

  override fun getTask(id: String): Result<TodoTask, DatabaseError> {
    return tasks[id].toResultOr { DatabaseError("Task not found") }
  }

  override fun insertTask(task: TodoTask): Result<Boolean, DatabaseError> {
    return when (tasks.putIfAbsent(task.id, task)) {
      null -> Ok(true)
      else -> Err(DatabaseError("Task already exists"))
    }
  }

  override fun updateTask(task: TodoTask): Result<Boolean, DatabaseError> {
    return when (tasks.putIfPresent(task.id, task)) {
      null -> Err(DatabaseError("Task does not exist"))
      else -> Ok(true)
    }
  }

  override fun deleteTask(id: String): Result<Boolean, DatabaseError> {
    return when (tasks.remove(id)) {
      null -> Err(DatabaseError("Task does not exist"))
      else -> Ok(true)
    }
  }
}


class FakeTaskDatabase(private val seed: Long? = null) : TaskDatabase() {
  private val faker = faker {
    fakerConfig {
      randomSeed = seed
    }
  }

  override val tasks: MutableMap<String, TodoTask> = mutableMapOf<String, TodoTask>().apply {

    faker.randomProvider.randomClassInstance<TodoTask>() {
      namedParameterGenerator("id") {
        faker.random.nextUUID()
      }
      namedParameterGenerator("title") {
        faker.backToTheFuture.characters()
      }
      namedParameterGenerator("description") {
        faker.backToTheFuture.quotes()
      }
      namedParameterGenerator("completed") {
        faker.random.nextBoolean()
      }
      namedParameterGenerator("dueDate") {
        Instant.now().plus(Duration.ofDays(3)).takeIf { faker.random.nextInt(0, 3) == 0 }
      }
    }

    repeat(10) {
      faker.randomProvider.randomClassInstance<TodoTask>().also {
        put(it.id, it)
      }
    }
  }

}

@Serializable
data class DatabaseError(
  val message: String
)
