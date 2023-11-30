package com.kronos.model

import io.ks3.java.time.InstantAsLongSerializer
import io.ks3.java.time.InstantAsStringSerializer
import kotlinx.serialization.Serializable
import java.time.Instant

@Serializable
data class TodoTask(
  val id: String,
  val title: String,
  val description: String,
  val completed: Boolean,
  @Serializable(with = InstantAsLongSerializer::class)
  val dueDate: Instant?,
//  val children: List<TodoTask>
)
