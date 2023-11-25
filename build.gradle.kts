val ktor_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
  alias(libs.plugins.kotlin.jvm)
  alias(libs.plugins.kotlin.serialization)
  alias(libs.plugins.ktor)
  alias(libs.plugins.versions)
  alias(libs.plugins.version.catalog.update)
}

group = "com.kronos"
version = "0.0.1"

application {
  mainClass.set("com.kronos.ApplicationKt")
}

repositories {
  mavenCentral()
}

dependencies {
  implementation(kotlin("stdlib"))

  // ktor server
  implementation(libs.bundles.ktor.server)

  // ktor client
  implementation(libs.bundles.ktor.client)

  // ktor common
  implementation(libs.ktor.serialization.kotlinx.json)

  implementation(platform(libs.supabase.bom))
  implementation(libs.supabase.postgrest)

  // misc
  implementation(libs.kotlin.faker)
  implementation(libs.kotlinx.serialization.json)

  // logging
  implementation(libs.logback.classic)

  //kotest
  testImplementation(libs.bundles.kotest)

  testImplementation("io.ktor:ktor-server-tests-jvm")
  testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

tasks.withType<Test>().configureEach {
  useJUnitPlatform()
}
