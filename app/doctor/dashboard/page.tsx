import { auth, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PendingDiagnoses } from "@/components/pending-diagnoses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User } from "lucide-react"
import Link from "next/link"
import clientPromise from "@/lib/mongodb"

export default async function DoctorDashboardPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  // Check if user has a doctor profile
  const client = await clientPromise
  const db = client.db()
  const doctor = await db.collection("doctors").findOne({ userId })

  if (!doctor) {
    redirect("/doctor/profile")
  }

  // Get stats
  const pendingCount = await db.collection("diagnosisRequests").countDocuments({ status: "ai-processed" })
  const reviewedCount = await db.collection("diagnosisRequests").countDocuments({
    "doctorReview.doctorId": userId,
  })

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome, Dr. {doctor.name}</h2>
          <p className="text-muted-foreground">Review and provide professional assessments for patient diagnoses.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Diagnoses waiting for your review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewedCount}</div>
              <p className="text-xs text-muted-foreground">Diagnoses you have reviewed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctor.specialization}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/doctor/profile" className="text-primary hover:underline">
                  View and edit your profile
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <PendingDiagnoses />
      </div>
    </DashboardLayout>
  )
}

