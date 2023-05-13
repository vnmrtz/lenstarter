let sponsors = [
    {
        lenshandle: "lenshandle1",
        ethereumaddress: "0x1234567890123456789012345678901234567890",
        amount: 100
    },
    {
        lenshandle: "lenshandle2",
        ethereumaddress: "0x1234567890123456789012345678901234567890",
        amount: 100
    },
    {
        lenshandle: "lenshandle3",
        ethereumaddress: "0x1234567890123456789012345678901234567890",
        amount: 100
    },
    {
        lenshandle: "lenshandle4",
        ethereumaddress: "0x1234567890123456789012345678901234567890",
        amount: 100
    },
    {
        lenshandle: "lenshandle5",
        ethereumaddress: "0x1234567890123456789012345678901234567890",
        amount: 100
    },
    {
        lenshandle: "lenshandle4",
        ethereumaddress: "0x1234567890123456789012345678901234567890",
        amount: 100
    },
    {
        lenshandle: "lenshandle5",
        ethereumaddress: "0x1234567890123456789012345678901234567890",
        amount: 100
    }
]

export default function Donation() {
    return (
        <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900">Latest Customers</h5>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                    View all
                </a>
            </div>
            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                    {sponsors.map((sponsor) => (
                        <li className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {sponsor.lenshandle}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {sponsor.ethereumaddress}
                                    </p>
                                </div>
                                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                    ${sponsor.amount}
                                </div>
                            </div>
                        </li>
                    ))
                    }
                </ul>
            </div>
        </div>
    )
}