interface Props {
    params: { id: string };
}

export default function Page({ params }: Props) {
    return (
        <div className="py-20 px-6">
            <h1 className="text-4xl font-bold mb-4">
                FabLab {params.id}
            </h1>

            <div className="p-6 rounded-xl shadow dark:bg-slate-900">
                <p>Description de l'établissement...</p>

                <div className="mt-6 inline-block px-4 py-2 bg-green-500 text-white rounded-full">
                    Accessible 100% Safe
                </div>
            </div>
        </div>
    );
}