import { db } from "@/db";
import { features, packages, packageFeatures } from "@/db/schema";
import { eq } from "drizzle-orm";
import FeatureMatrixClient from "./FeatureMatrixClient";

export default async function FeaturesPage() {
    // Fetch all features
    const allFeatures = await db.select().from(features).orderBy(features.isCore);

    // Fetch all packages with their features
    const allPackages = await db.select().from(packages).orderBy(packages.price);

    // Fetch package-feature relationships
    const allPackageFeatures = await db.select().from(packageFeatures);

    // Build a map of packageId -> featureIds[]
    const packageFeatureMap: Record<number, number[]> = {};
    allPackageFeatures.forEach((pf) => {
        if (!packageFeatureMap[pf.packageId]) {
            packageFeatureMap[pf.packageId] = [];
        }
        packageFeatureMap[pf.packageId].push(pf.featureId);
    });

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Features & Paket Management</h1>
                <p className="text-slate-500 font-medium">
                    Kelola fitur-fitur yang tersedia untuk setiap paket langganan
                </p>
            </div>

            <FeatureMatrixClient
                features={allFeatures}
                packages={allPackages}
                packageFeatureMap={packageFeatureMap}
            />
        </div>
    );
}
