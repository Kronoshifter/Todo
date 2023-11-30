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
  fun taskList(): List<TodoTask>
  fun getTask(id: String): Result<TodoTask, DatabaseError>
  fun insertTask(task: TodoTask): Result<Boolean, DatabaseError>
  fun updateTask(task: TodoTask): Result<Boolean, DatabaseError>
  fun deleteTask(id: String): Result<Boolean, DatabaseError>
}

open class TaskDatabase : Database {
  protected open val tasks = mutableListOf<TodoTask>()

  override fun taskList(): List<TodoTask> {
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
  }

  override val tasks: MutableList<TodoTask> = MutableList(10) {
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
  }


}

@Serializable
data class DatabaseError(
  val message: String
)
