import { db } from "@/lib/db";

export async function getDashboardSummary() {
  const [totalFamilies, totalChildren, checkedInChildren, imageConsentData, healthAlerts] = await Promise.all([
    db.family.count(),
    db.child.count(),
    db.child.count({ where: { NOT: { checkedInAt: null } } }),
    db.child.groupBy({ by: ["imageConsent"], _count: { _all: true } }),
    db.child.count({
      where: {
        OR: [
          { allergies: { not: null } },
          { foodRestriction: { not: null } },
          { hasHealthCondition: true },
          { continuousMedication: true },
        ],
      },
    }),
  ]);

  const imageGranted = imageConsentData.find((i) => i.imageConsent === "GRANTED")?._count._all ?? 0;
  const imageDenied = imageConsentData.find((i) => i.imageConsent === "DENIED")?._count._all ?? 0;

  return {
    totalFamilies,
    totalChildren,
    checkedInChildren,
    attendanceRate: totalChildren > 0 ? Number(((checkedInChildren / totalChildren) * 100).toFixed(1)) : 0,
    healthAlerts,
    imageGranted,
    imageDenied,
  };
}
