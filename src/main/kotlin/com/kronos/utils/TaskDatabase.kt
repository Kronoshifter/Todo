package com.kronos.utils

import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.andThen
import com.github.michaelbull.result.toResultOr
import com.kronos.model.TodoTask
import io.github.serpro69.kfaker.faker
import kotlinx.serialization.Serializable
import java.time.Duration
import java.time.Instant


sealed interface Database {
  fun list(): List<TodoTask>
  fun getTask(id: String): Result<TodoTask, DatabaseError>
  fun insertTask(task: TodoTask): Result<Boolean, DatabaseError>
  fun updateTask(task: TodoTask): Result<Boolean, DatabaseError>
  fun deleteTask(id: String): Result<Boolean, DatabaseError>
}

open class TaskDatabase : Database {
  protected open val tasks = mutableListOf<TodoTask>()

  override fun list(): List<TodoTask> {
    return tasks.toList()
  }

  override fun getTask(id: String): Result<TodoTask, DatabaseError> {
    return tasks.find { it.id == id }.toResultOr { DatabaseError("Task not found") }
  }

  override fun insertTask(task: TodoTask): Result<Boolean, DatabaseError> {
    return Ok(tasks.add(task))
  }

  override fun updateTask(task: TodoTask): Result<Boolean, DatabaseError> {
    return tasks.indexOfFirst { it.id == task.id }.takeIf { it >= 0 }?.let { index ->
      tasks[index] = task
      return@let true
    }.toResultOr { DatabaseError("Task could not be updated") }
  }

  override fun deleteTask(id: String): Result<Boolean, DatabaseError> {
    return getTask(id).andThen {
      tasks.remove(it).toResultOr { DatabaseError("Task could not be deleted") }
    }
  }
}


class FakeTaskDatabase(private val seed: Long? = null) : TaskDatabase() {
  private val faker = faker {
    fakerConfig {
      randomSeed = seed
    }
  }.also { faker ->
    faker.randomProvider.configure {
      typeGenerator<TodoTask> {
        TodoTask(
          id = faker.random.nextUUID(),
          title = faker.backToTheFuture.characters(),
          description = faker.backToTheFuture.characters(),
          completed = faker.random.nextBoolean(),
          dueDate = Instant.now().plus(Duration.ofDays(faker.random.nextLong(10))),
        )
      }
    }
  }

  override val tasks = MutableList(100) {
    faker.randomProvider.randomClassInstance<TodoTask>()
  }


}

@Serializable
data class DatabaseError(
  val message: String
)
